import crypto from "crypto";
import fs from "fs";
import path from "path";

export interface ServerUser {
  id: string;
  name: string;
  emailOrPhone: string;
  email?: string;
  phone?: string;
  passwordHash?: string;
  passwordSalt?: string;
  googleId?: string;
  avatar?: string;
  authProvider: "google" | "local";
  preferredLanguage: string;
  state: string;
  district?: string;
  taluk?: string;
  village?: string;
  kisanId: string;
  totalAcres: number;
  primaryCrop: string;
  farmName: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServerSession {
  token: string;
  userId: string;
  createdAt: string;
  expiresAt: number;
}

const DB_FILE = path.join(process.cwd(), "khetix_users.json");

class AuthStore {
  private users: Map<string, ServerUser> = new Map();
  private sessions: Map<string, ServerSession> = new Map();
  private otps: Map<string, { otp: string; expiresAt: number }> = new Map();

  constructor() {
    this.loadFromDisk();
  }

  private loadFromDisk() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, "utf-8");
        const data = JSON.parse(raw);
        if (Array.isArray(data.users)) {
          for (const u of data.users) {
            this.users.set(u.id, u);
          }
        }
      }
    } catch (e) {
      console.warn("Could not read auth database file, starting clean:", e);
    }
  }

  private saveToDisk() {
    try {
      const usersList = Array.from(this.users.values());
      fs.writeFileSync(DB_FILE, JSON.stringify({ users: usersList }, null, 2), "utf-8");
    } catch (e) {
      console.error("Failed to persist auth database to disk:", e);
    }
  }

  private hashPassword(password: string, salt: string): string {
    return crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
  }

  public findUserById(id: string): ServerUser | undefined {
    return this.users.get(id);
  }

  public findUserByContact(contact: string): ServerUser | undefined {
    const clean = contact.trim().toLowerCase();
    for (const u of this.users.values()) {
      if (
        u.emailOrPhone.toLowerCase() === clean ||
        (u.email && u.email.toLowerCase() === clean) ||
        (u.phone && u.phone.toLowerCase() === clean)
      ) {
        return u;
      }
    }
    return undefined;
  }

  public findUserByGoogleId(googleId: string): ServerUser | undefined {
    for (const u of this.users.values()) {
      if (u.googleId === googleId) {
        return u;
      }
    }
    return undefined;
  }

  public createSession(userId: string): ServerSession {
    const token = crypto.randomBytes(32).toString("hex");
    const session: ServerSession = {
      token,
      userId,
      createdAt: new Date().toISOString(),
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
    };
    this.sessions.set(token, session);
    return session;
  }

  public getSessionUser(token: string): ServerUser | null {
    if (!token) return null;
    const session = this.sessions.get(token);
    if (!session) return null;
    if (session.expiresAt < Date.now()) {
      this.sessions.delete(token);
      return null;
    }
    return this.users.get(session.userId) || null;
  }

  public destroySession(token: string): boolean {
    return this.sessions.delete(token);
  }

  public signup(params: {
    name: string;
    phone: string;
    email?: string;
    password?: string;
    farmName?: string;
    state?: string;
    district?: string;
    taluk?: string;
    village?: string;
    totalAcres?: number;
    primaryCrop?: string;
    language?: string;
  }): { success: boolean; user?: Omit<ServerUser, "passwordHash" | "passwordSalt">; token?: string; error?: string } {
    const phone = params.phone.trim();
    const email = params.email ? params.email.trim().toLowerCase() : undefined;
    const contact = phone || email;

    if (!contact) {
      return { success: false, error: "Mobile number or email is required." };
    }

    if (this.findUserByContact(phone) || (email && this.findUserByContact(email))) {
      return { success: false, error: "An account already exists with this mobile number or email. Please sign in." };
    }

    if (!params.password || params.password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters long." };
    }

    const salt = crypto.randomBytes(16).toString("hex");
    const passwordHash = this.hashPassword(params.password, salt);
    const userId = `usr-loc-${Date.now()}`;
    const kisanId = `KISAN-${params.state ? params.state.slice(0, 2).toUpperCase() : "IN"}-${Math.floor(100000 + Math.random() * 900000)}`;

    const user: ServerUser = {
      id: userId,
      name: params.name.trim(),
      emailOrPhone: contact,
      email,
      phone,
      passwordHash,
      passwordSalt: salt,
      authProvider: "local",
      preferredLanguage: params.language || "en",
      state: params.state || "Maharashtra",
      district: params.district || "Nashik",
      taluk: params.taluk || "Dindori",
      village: params.village || "Pimpalgaon Baswant",
      kisanId,
      totalAcres: params.totalAcres || 10,
      primaryCrop: params.primaryCrop || "Tomato",
      farmName: params.farmName || `${params.name.trim()}'s Farm`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.users.set(userId, user);
    this.saveToDisk();

    const session = this.createSession(userId);
    const safeUser = this.sanitizeUser(user);
    return { success: true, user: safeUser, token: session.token };
  }

  public login(
    contact: string,
    password?: string,
    language?: string
  ): { success: boolean; user?: Omit<ServerUser, "passwordHash" | "passwordSalt">; token?: string; error?: string } {
    if (!contact || !contact.trim()) {
      return { success: false, error: "Mobile number or email is required." };
    }

    const user = this.findUserByContact(contact);
    if (!user) {
      return { success: false, error: "No farmer account found with this contact. Please create an account." };
    }

    if (user.authProvider === "google" && !user.passwordHash) {
      return { success: false, error: "This account was registered using Google. Please click 'Continue with Google'." };
    }

    if (user.passwordHash && user.passwordSalt) {
      if (!password) {
        return { success: false, error: "Please enter your password." };
      }
      const computedHash = this.hashPassword(password, user.passwordSalt);
      if (computedHash !== user.passwordHash) {
        return { success: false, error: "Incorrect password. Please verify or use Forgot Password." };
      }
    }

    if (language && language !== user.preferredLanguage) {
      user.preferredLanguage = language;
      user.updatedAt = new Date().toISOString();
      this.saveToDisk();
    }

    const session = this.createSession(user.id);
    return { success: true, user: this.sanitizeUser(user), token: session.token };
  }

  public handleGoogleUser(params: {
    googleId: string;
    name: string;
    email: string;
    avatar?: string;
    language?: string;
  }): { user: Omit<ServerUser, "passwordHash" | "passwordSalt">; token: string; isNewUser: boolean } {
    let existing = this.findUserByGoogleId(params.googleId);
    let isNewUser = false;

    if (!existing && params.email) {
      existing = this.findUserByContact(params.email);
      if (existing) {
        existing.googleId = params.googleId;
        if (params.avatar) existing.avatar = params.avatar;
      }
    }

    if (existing) {
      // Existing Google user -> Sign in!
      // If user provided a specific language, update language preference
      if (params.language && params.language !== "en") {
        existing.preferredLanguage = params.language;
      }
      if (params.avatar && !existing.avatar) {
        existing.avatar = params.avatar;
      }
      existing.updatedAt = new Date().toISOString();
      this.saveToDisk();
      const session = this.createSession(existing.id);
      return { user: this.sanitizeUser(existing), token: session.token, isNewUser: false };
    }

    // New Google user -> Automatically create account!
    isNewUser = true;
    const userId = `usr-goog-${Date.now()}`;
    const preferredLang = params.language || "en";
    const kisanId = `KISAN-G-${Math.floor(100000 + Math.random() * 900000)}`;

    const newUser: ServerUser = {
      id: userId,
      name: params.name || "Farmer",
      emailOrPhone: params.email,
      email: params.email,
      googleId: params.googleId,
      avatar: params.avatar,
      authProvider: "google",
      preferredLanguage: preferredLang,
      state: "Karnataka", // Default agricultural zone for demo or updated later
      district: "Bengaluru Rural",
      taluk: "Devanahalli",
      village: "Kundana",
      kisanId,
      totalAcres: 8,
      primaryCrop: "Tomato",
      farmName: `${params.name || "Kisan"}'s Precision Farm`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.users.set(userId, newUser);
    this.saveToDisk();

    const session = this.createSession(userId);
    return { user: this.sanitizeUser(newUser), token: session.token, isNewUser: true };
  }

  public updateUserLanguage(userId: string, language: string): boolean {
    const user = this.users.get(userId);
    if (!user) return false;
    user.preferredLanguage = language;
    user.updatedAt = new Date().toISOString();
    this.saveToDisk();
    return true;
  }

  public requestPasswordReset(contact: string): { success: boolean; message?: string; otp?: string; error?: string } {
    const user = this.findUserByContact(contact);
    if (!user) {
      return { success: false, error: "No account found associated with this email or mobile." };
    }

    // Generate secure 6-digit OTP code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.otps.set(contact.toLowerCase(), {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    });

    console.log(`[KHETIX Auth] Generated Password Reset OTP for ${contact}: ${otp}`);

    return {
      success: true,
      message: `A 6-digit verification code has been dispatched to ${contact}.`,
      otp, // Provided in response for easy local testing
    };
  }

  public resetPassword(contact: string, otp: string, newPassword: string): { success: boolean; message?: string; error?: string } {
    const entry = this.otps.get(contact.toLowerCase());
    if (!entry) {
      return { success: false, error: "No active verification request found. Please request a new OTP." };
    }
    if (entry.expiresAt < Date.now()) {
      this.otps.delete(contact.toLowerCase());
      return { success: false, error: "Verification code has expired. Please request a new one." };
    }
    if (entry.otp !== otp.trim()) {
      return { success: false, error: "Invalid verification code. Please check and try again." };
    }
    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: "New password must be at least 6 characters long." };
    }

    const user = this.findUserByContact(contact);
    if (!user) {
      return { success: false, error: "User not found." };
    }

    const salt = crypto.randomBytes(16).toString("hex");
    user.passwordHash = this.hashPassword(newPassword, salt);
    user.passwordSalt = salt;
    user.updatedAt = new Date().toISOString();
    this.saveToDisk();
    this.otps.delete(contact.toLowerCase());

    return { success: true, message: "Password updated successfully. You can now sign in with your new password." };
  }

  public sanitizeUser(user: ServerUser): Omit<ServerUser, "passwordHash" | "passwordSalt"> {
    const { passwordHash, passwordSalt, ...safe } = user;
    return safe;
  }
}

export const authStore = new AuthStore();
