import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Farm,
  Field,
  AlertNotification,
  CartItem,
  MarketplaceProduct,
  TodayFarmPlanItem,
  FarmCalendarEvent,
  InventoryItem,
  ExpenseRecord,
  LabourWorker,
  FarmJournalEntry,
  FarmDocument,
  AppLanguage,
  UserAccount,
} from '../../types';
import {
  INITIAL_FARMS,
  INITIAL_NOTIFICATIONS,
  INITIAL_TODAY_PLAN,
  INITIAL_TODAY_TASKS,
  INITIAL_CALENDAR_EVENTS,
  INITIAL_INVENTORY,
  INITIAL_EXPENSES,
  INITIAL_LABOUR,
  INITIAL_JOURNAL,
  INITIAL_DOCUMENTS,
} from '../data/mockData';
import { TRANSLATIONS, TranslationSet } from '../data/translations';
import { getTranslation, SupportedLanguage } from '../i18n';

export type NavigationModule =
  | 'landing'
  | 'dashboard'
  | 'farmer-profile'
  | 'farms'
  | 'calendar'
  | 'lifecycle'
  | 'fertilizer-calc'
  | 'pest-alerts'
  | 'irrigation-calc'
  | 'harvest-planner'
  | 'inventory'
  | 'expenses'
  | 'labour'
  | 'journal'
  | 'yield-prediction'
  | 'documents'
  | 'crops-disease'
  | 'crops-recommend'
  | 'irrigation'
  | 'weather'
  | 'market'
  | 'soil'
  | 'marketplace'
  | 'livestock'
  | 'analytics'
  | 'satellite'
  | 'sustainability'
  | 'finance'
  | 'assistant'
  | 'reports'
  | 'supply-chain';

export interface TodayTaskItem {
  id: string;
  title: string;
  completed: boolean;
  field: string;
  priority: 'high' | 'medium' | 'low';
}

export interface PlacedOrder {
  id: string;
  items: CartItem[];
  total: number;
  deliveryAddress: string;
  paymentMethod: string;
  createdAt: string;
  status: 'Processing' | 'Dispatched' | 'Delivered';
}

export interface SignupInput {
  name: string;
  phone?: string;
  email?: string;
  emailOrPhone?: string;
  password?: string;
  farmName?: string;
  state: string;
  district?: string;
  taluk?: string;
  village?: string;
  totalAcres?: number;
  primaryCrop?: string;
  kisanId?: string;
  language?: string;
}

export interface AuthResponse {
  success: boolean;
  error?: string;
  user?: UserAccount;
}

interface FarmContextType {
  currentUser: UserAccount | null;
  authLoading: boolean;
  login: (emailOrPhone: string, password?: string) => Promise<AuthResponse>;
  signup: (
    inputOrName: SignupInput | string,
    emailOrPhone?: string,
    state?: string,
    district?: string,
    kisanId?: string
  ) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  requestPasswordReset: (emailOrPhone: string) => Promise<{ success: boolean; message?: string; otp?: string; error?: string }>;
  resetPassword: (emailOrPhone: string, otp: string, newPassword: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  farms: Farm[];
  activeFarm: Farm;
  hasFarms: boolean;
  setActiveFarmId: (id: string) => void;
  updateActiveFarm: (updatedFarm: Partial<Farm>) => void;
  addNewFarm: (newFarm: Farm) => void;
  deleteFarm: (farmId: string) => void;
  activeModule: NavigationModule;
  setActiveModule: (module: NavigationModule) => void;
  soilMoistureOverride: number;
  setSoilMoistureOverride: (val: number) => void;
  rainProbabilityOverride: number;
  setRainProbabilityOverride: (val: number) => void;
  toggleFieldValve: (fieldId: string) => void;
  notifications: AlertNotification[];
  unreadCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  cart: CartItem[];
  addToCart: (product: MarketplaceProduct, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQty: (productId: string, delta: number) => void;
  clearCart: () => void;
  cartTotal: number;
  orders: PlacedOrder[];
  placeOrder: (deliveryAddress: string, paymentMethod: string) => string;
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  t: (key: string, fallback?: string) => string;
  rawT: TranslationSet;
  quickActionTrigger: string | null;
  setQuickActionTrigger: (action: string | null) => void;

  // Domain States & Handlers
  todayPlan: TodayFarmPlanItem[];
  togglePlanItem: (id: string) => void;
  todayTasks: TodayTaskItem[];
  toggleTodayTask: (id: string) => void;
  addTodayTask: (title: string, field: string, priority: 'high' | 'medium' | 'low') => void;
  calendarEvents: FarmCalendarEvent[];
  addCalendarEvent: (event: Omit<FarmCalendarEvent, 'id'>) => void;
  toggleCalendarEvent: (id: string) => void;
  inventory: InventoryItem[];
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  updateInventoryStock: (id: string, newQty: number) => void;
  expenses: ExpenseRecord[];
  addExpenseRecord: (expense: Omit<ExpenseRecord, 'id'>) => void;
  labour: LabourWorker[];
  updateWorkerAttendance: (id: string, status: 'Present' | 'Absent' | 'Half Day') => void;
  addWorker: (worker: Omit<LabourWorker, 'id'>) => void;
  journal: FarmJournalEntry[];
  addJournalEntry: (entry: Omit<FarmJournalEntry, 'id'>) => void;
  documents: FarmDocument[];
  addDocument: (doc: Omit<FarmDocument, 'id'>) => void;
}

const FarmContext = createContext<FarmContextType | undefined>(undefined);

export const FarmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Authentication State - Null by default unless a real verified session is restored
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem('khetix_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [authLoading, setAuthLoading] = useState<boolean>(true);

  const [farms, setFarms] = useState<Farm[]>(() => {
    const saved = localStorage.getItem('khetix_farms');
    return saved ? JSON.parse(saved) : INITIAL_FARMS;
  });

  const [activeFarmId, setActiveFarmIdState] = useState<string>(() => {
    return localStorage.getItem('khetix_active_farm_id') || (INITIAL_FARMS[0]?.id || '');
  });

  const [activeModule, setActiveModuleState] = useState<NavigationModule>(() => {
    const savedUser = localStorage.getItem('khetix_user');
    const saved = localStorage.getItem('khetix_module') as NavigationModule;
    // Strict route protection: Unauthenticated visitors are directed to landing
    if (!savedUser) return 'landing';
    return saved || 'dashboard';
  });

  const [soilMoistureOverride, setSoilMoistureOverride] = useState<number>(64);
  const [rainProbabilityOverride, setRainProbabilityOverride] = useState<number>(72);

  const [notifications, setNotifications] = useState<AlertNotification[]>(() => {
    const saved = localStorage.getItem('khetix_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('khetix_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<PlacedOrder[]>(() => {
    const saved = localStorage.getItem('khetix_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [language, setLanguageState] = useState<AppLanguage>(() => {
    return (localStorage.getItem('khetix_lang') as AppLanguage) || 'en';
  });

  const [todayPlan, setTodayPlan] = useState<TodayFarmPlanItem[]>(() => {
    const saved = localStorage.getItem('khetix_today_plan');
    return saved ? JSON.parse(saved) : INITIAL_TODAY_PLAN;
  });

  const [todayTasks, setTodayTasks] = useState<TodayTaskItem[]>(() => {
    const saved = localStorage.getItem('khetix_today_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TODAY_TASKS;
  });

  const [calendarEvents, setCalendarEvents] = useState<FarmCalendarEvent[]>(() => {
    const saved = localStorage.getItem('khetix_calendar_events');
    return saved ? JSON.parse(saved) : INITIAL_CALENDAR_EVENTS;
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('khetix_inventory');
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });

  const [expenses, setExpenses] = useState<ExpenseRecord[]>(() => {
    const saved = localStorage.getItem('khetix_expenses');
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });

  const [labour, setLabour] = useState<LabourWorker[]>(() => {
    const saved = localStorage.getItem('khetix_labour');
    return saved ? JSON.parse(saved) : INITIAL_LABOUR;
  });

  const [journal, setJournal] = useState<FarmJournalEntry[]>(() => {
    const saved = localStorage.getItem('khetix_journal');
    return saved ? JSON.parse(saved) : INITIAL_JOURNAL;
  });

  const [documents, setDocuments] = useState<FarmDocument[]>(() => {
    const saved = localStorage.getItem('khetix_documents');
    return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
  });

  const [quickActionTrigger, setQuickActionTrigger] = useState<string | null>(null);

  // Restore session from server and handle OAuth callbacks
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        let activeToken = localStorage.getItem('khetix_session_token');

        // Check if returning from Google OAuth redirect
        if (typeof window !== 'undefined') {
          const urlParams = new URLSearchParams(window.location.search);
          const authSuccess = urlParams.get('auth_success');
          const tokenParam = urlParams.get('token');
          const langParam = urlParams.get('lang');

          if (authSuccess === '1' && tokenParam) {
            activeToken = tokenParam;
            localStorage.setItem('khetix_session_token', tokenParam);

            // Crucial: Preserve language chosen before Google OAuth redirect
            if (langParam) {
              setLanguageState(langParam as AppLanguage);
              localStorage.setItem('khetix_lang', langParam);
            }

            // Clean query parameters from URL for clean browser state
            const cleanUrl = window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
          }
        }

        // Verify session with server endpoint
        const headers: Record<string, string> = {};
        if (activeToken) {
          headers['Authorization'] = `Bearer ${activeToken}`;
        }

        const res = await fetch('/api/auth/me', { headers });
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            setCurrentUser(data.user);
            localStorage.setItem('khetix_user', JSON.stringify(data.user));

            // Sync user's saved language preference if present
            if (data.user.preferredLanguage) {
              setLanguageState(data.user.preferredLanguage as AppLanguage);
              localStorage.setItem('khetix_lang', data.user.preferredLanguage);
            }

            // If returning from successful OAuth, take directly to Dashboard
            if (typeof window !== 'undefined' && window.location.search.includes('auth_success=1')) {
              setActiveModuleState('dashboard');
            }
          } else {
            setCurrentUser(null);
            localStorage.removeItem('khetix_user');
            localStorage.removeItem('khetix_session_token');
            setActiveModuleState('landing');
          }
        } else {
          setCurrentUser(null);
          localStorage.removeItem('khetix_user');
          localStorage.removeItem('khetix_session_token');
          setActiveModuleState('landing');
        }
      } catch (err) {
        console.warn('Session verification exception:', err);
      } finally {
        setAuthLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('khetix_farms', JSON.stringify(farms));
  }, [farms]);

  useEffect(() => {
    localStorage.setItem('khetix_active_farm_id', activeFarmId);
  }, [activeFarmId]);

  useEffect(() => {
    localStorage.setItem('khetix_module', activeModule);
  }, [activeModule]);

  useEffect(() => {
    localStorage.setItem('khetix_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('khetix_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('khetix_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('khetix_today_plan', JSON.stringify(todayPlan));
  }, [todayPlan]);

  useEffect(() => {
    localStorage.setItem('khetix_today_tasks', JSON.stringify(todayTasks));
  }, [todayTasks]);

  useEffect(() => {
    localStorage.setItem('khetix_calendar_events', JSON.stringify(calendarEvents));
  }, [calendarEvents]);

  useEffect(() => {
    localStorage.setItem('khetix_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('khetix_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('khetix_labour', JSON.stringify(labour));
  }, [labour]);

  useEffect(() => {
    localStorage.setItem('khetix_journal', JSON.stringify(journal));
  }, [journal]);

  useEffect(() => {
    localStorage.setItem('khetix_documents', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('khetix_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('khetix_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('khetix_orders', JSON.stringify(orders));
  }, [orders]);

  const defaultFarm: Farm = {
    id: 'farm-default',
    name: 'My New Farm',
    farmerName: currentUser?.name || 'Farmer',
    location: 'Nashik, Maharashtra',
    state: 'Maharashtra',
    district: 'Nashik',
    totalAcres: 5,
    primaryCrop: 'Wheat',
    soilType: 'Loamy Soil',
    soilMoisture: 55,
    rainProbability: 15,
    fields: [
      {
        id: 'field-1',
        name: 'Plot 1 - Main Field',
        crop: 'Wheat',
        variety: 'Sharbati HD-2967',
        acres: 5,
        sowingDate: '2025-11-10',
        stage: 'Vegetative',
        soilMoisture: 55,
        valvesOpen: false,
        nitrogenLevel: 'Adequate',
        phosphorusLevel: 'Optimal',
        potassiumLevel: 'High',
        ph: 6.8,
        organicCarbon: '0.62%',
        healthIndex: 88,
      },
    ],
  };

  const hasFarms = farms.length > 0;
  const activeFarm: Farm = farms.find((f) => f.id === activeFarmId) || farms[0] || defaultFarm;

  const setActiveFarmId = (id: string) => {
    setActiveFarmIdState(id);
    const target = farms.find((f) => f.id === id);
    if (target) {
      setSoilMoistureOverride(target.soilMoisture);
    }
  };

  const updateActiveFarm = (updatedProps: Partial<Farm>) => {
    setFarms((prev) =>
      prev.map((farm) => (farm.id === activeFarm.id ? { ...farm, ...updatedProps } : farm))
    );
  };

  const addNewFarm = (newFarm: Farm) => {
    setFarms((prev) => [...prev, newFarm]);
    setActiveFarmIdState(newFarm.id);
  };

  const deleteFarm = (farmId: string) => {
    setFarms((prev) => {
      const filtered = prev.filter((f) => f.id !== farmId);
      if (activeFarmId === farmId) {
        setActiveFarmIdState(filtered[0]?.id || '');
      }
      return filtered;
    });
  };

  const setActiveModule = (module: NavigationModule) => {
    setActiveModuleState(module);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setLanguage = (lang: AppLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('khetix_lang', lang);

    // Persist language preference to authenticated user's server account
    if (currentUser) {
      const token = localStorage.getItem('khetix_session_token');
      fetch('/api/auth/user/language', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ language: lang }),
      }).catch((e) => console.warn('Could not sync language to user account:', e));
    }
  };

  const t = (key: string, fallback?: string): string => {
    return getTranslation(language as SupportedLanguage, key, fallback);
  };

  const rawT = TRANSLATIONS[language as keyof typeof TRANSLATIONS] || TRANSLATIONS.en;

  const login = async (emailOrPhone: string, password?: string): Promise<AuthResponse> => {
    if (!emailOrPhone || !emailOrPhone.trim()) {
      return { success: false, error: 'Mobile number or email is required.' };
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailOrPhone: emailOrPhone.trim(),
          password,
          language,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        return { success: false, error: data.error || 'Authentication failed. Please verify credentials.' };
      }

      if (data.token) {
        localStorage.setItem('khetix_session_token', data.token);
      }
      if (data.user) {
        setCurrentUser(data.user);
        localStorage.setItem('khetix_user', JSON.stringify(data.user));
        if (data.user.preferredLanguage) {
          setLanguageState(data.user.preferredLanguage as AppLanguage);
          localStorage.setItem('khetix_lang', data.user.preferredLanguage);
        }
      }

      setActiveModuleState('dashboard');
      return { success: true, user: data.user };
    } catch (err: any) {
      console.error('Login network error:', err);
      return { success: false, error: 'Unable to connect to KHETIX authentication service.' };
    }
  };

  const signup = async (
    inputOrName: SignupInput | string,
    emailOrPhoneParam?: string,
    stateParam?: string,
    districtParam?: string,
    kisanIdParam?: string
  ): Promise<AuthResponse> => {
    let input: SignupInput;

    if (typeof inputOrName === 'string') {
      input = {
        name: inputOrName,
        emailOrPhone: emailOrPhoneParam || '',
        state: stateParam || 'Maharashtra',
        district: districtParam || 'Nashik',
        kisanId: kisanIdParam,
      };
    } else {
      input = inputOrName;
    }

    const resolvedName = input.name || 'Farmer';
    const resolvedContact = input.phone || input.email || input.emailOrPhone || '';
    const phone = input.phone || (resolvedContact.includes('@') ? '' : resolvedContact);
    const email = input.email || (resolvedContact.includes('@') ? resolvedContact : '');

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: resolvedName,
          phone: phone || resolvedContact,
          email,
          password: input.password,
          farmName: input.farmName || `${resolvedName}'s Farm`,
          state: input.state || 'Maharashtra',
          district: input.district || 'Nashik',
          taluk: input.taluk || 'Dindori',
          village: input.village || 'Pimpalgaon Baswant',
          totalAcres: input.totalAcres || 10,
          primaryCrop: input.primaryCrop || 'Tomato',
          language,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        return { success: false, error: data.error || 'Registration failed. Please check details.' };
      }

      if (data.token) {
        localStorage.setItem('khetix_session_token', data.token);
      }
      if (data.user) {
        setCurrentUser(data.user);
        localStorage.setItem('khetix_user', JSON.stringify(data.user));

        // Create initial live farm in state
        const farmId = `farm-${Date.now()}`;
        const newFarm: Farm = {
          id: farmId,
          name: input.farmName || `${resolvedName}'s Farm`,
          farmerName: resolvedName,
          location: [input.village, input.taluk, input.district, input.state].filter(Boolean).join(', '),
          state: input.state || 'Maharashtra',
          district: input.district || 'Nashik',
          totalAcres: input.totalAcres || 10,
          primaryCrop: input.primaryCrop || 'Tomato',
          soilType: 'Clay Loam (Black Soil)',
          soilMoisture: 62,
          rainProbability: 25,
          fields: [
            {
              id: `field-${Date.now()}-1`,
              name: `Plot 1 - Main ${input.primaryCrop || 'Tomato'} Field`,
              crop: input.primaryCrop || 'Tomato',
              variety: 'High-Yield Certified F1',
              acres: input.totalAcres || 10,
              sowingDate: new Date().toISOString().slice(0, 10),
              stage: 'Vegetative',
              soilMoisture: 62,
              valvesOpen: false,
              nitrogenLevel: 'Adequate',
              phosphorusLevel: 'Optimal',
              potassiumLevel: 'Optimal',
              ph: 6.8,
              organicCarbon: '0.68%',
              healthIndex: 94,
            },
          ],
        };

        setFarms((prev) => [newFarm, ...prev]);
        setActiveFarmIdState(farmId);
      }

      setActiveModuleState('dashboard');
      return { success: true, user: data.user };
    } catch (err: any) {
      console.error('Signup network error:', err);
      return { success: false, error: 'Network error connecting to KHETIX authentication server.' };
    }
  };

  const requestPasswordReset = async (emailOrPhone: string): Promise<{ success: boolean; message?: string; otp?: string; error?: string }> => {
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrPhone }),
      });
      return await response.json();
    } catch (err: any) {
      return { success: false, error: 'Could not contact server for password reset.' };
    }
  };

  const resetPassword = async (emailOrPhone: string, otp: string, newPassword: string): Promise<{ success: boolean; message?: string; error?: string }> => {
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrPhone, otp, newPassword }),
      });
      return await response.json();
    } catch (err: any) {
      return { success: false, error: 'Password update request failed.' };
    }
  };

  const placeOrder = (deliveryAddress: string, paymentMethod: string): string => {
    if (cart.length === 0) return '';
    const orderId = `ORD-${Date.now().toString().slice(-6)}`;
    const newOrder: PlacedOrder = {
      id: orderId,
      items: [...cart],
      total: cartTotal,
      deliveryAddress,
      paymentMethod,
      createdAt: new Date().toISOString(),
      status: 'Processing',
    };
    setOrders((prev) => [newOrder, ...prev]);

    // Automatically record an expense for financial tracking
    addExpenseRecord({
      date: new Date().toISOString().slice(0, 10),
      category: 'Seeds & Chemicals',
      amount: cartTotal,
      description: `Agri-Store Order #${orderId} (${cart.map((c) => c.product.name).join(', ')})`,
      paymentMethod: paymentMethod === 'cod' ? 'Cash' : 'UPI',
    });

    // Asynchronously notify backend order endpoint
    fetch('/api/marketplace/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: cart,
        deliveryAddress,
        paymentMethod,
        farmerId: currentUser?.kisanId || 'KISAN-2026',
        totalAmount: cartTotal,
      }),
    }).catch((err) => {
      console.warn('Backend order sync note:', err);
    });

    clearCart();
    return orderId;
  };

  const toggleFieldValve = (fieldId: string) => {
    setFarms((prevFarms) =>
      prevFarms.map((farm) => {
        if (farm.id !== activeFarm.id) return farm;
        return {
          ...farm,
          fields: farm.fields.map((field) =>
            field.id === fieldId ? { ...field, valvesOpen: !field.valvesOpen } : field
          ),
        };
      })
    );
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const togglePlanItem = (id: string) => {
    setTodayPlan((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: item.status === 'completed' ? 'pending' : 'completed' }
          : item
      )
    );
  };

  const toggleTodayTask = (id: string) => {
    setTodayTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const addTodayTask = (title: string, field: string, priority: 'high' | 'medium' | 'low') => {
    const newTask: TodayTaskItem = {
      id: `task-${Date.now()}`,
      title,
      field,
      priority,
      completed: false,
    };
    setTodayTasks((prev) => [newTask, ...prev]);
  };

  const addCalendarEvent = (event: Omit<FarmCalendarEvent, 'id'>) => {
    const newEv: FarmCalendarEvent = {
      ...event,
      id: `cal-${Date.now()}`,
    };
    setCalendarEvents((prev) => [newEv, ...prev]);
  };

  const toggleCalendarEvent = (id: string) => {
    setCalendarEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, completed: !e.completed } : e))
    );
  };

  const addInventoryItem = (item: Omit<InventoryItem, 'id'>) => {
    const newItem: InventoryItem = {
      ...item,
      id: `inv-${Date.now()}`,
    };
    setInventory((prev) => [newItem, ...prev]);
  };

  const updateInventoryStock = (id: string, newQty: number) => {
    setInventory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: Math.max(0, newQty) } : item))
    );
  };

  const addExpenseRecord = (expense: Omit<ExpenseRecord, 'id'>) => {
    const newExp: ExpenseRecord = {
      ...expense,
      id: `exp-${Date.now()}`,
    };
    setExpenses((prev) => [newExp, ...prev]);
  };

  const updateWorkerAttendance = (id: string, status: 'Present' | 'Absent' | 'Half Day') => {
    setLabour((prev) =>
      prev.map((w) => (w.id === id ? { ...w, attendanceStatus: status } : w))
    );
  };

  const addWorker = (worker: Omit<LabourWorker, 'id'>) => {
    const newWorker: LabourWorker = {
      ...worker,
      id: `lab-${Date.now()}`,
    };
    setLabour((prev) => [...prev, newWorker]);
  };

  const addJournalEntry = (entry: Omit<FarmJournalEntry, 'id'>) => {
    const newEntry: FarmJournalEntry = {
      ...entry,
      id: `j-${Date.now()}`,
    };
    setJournal((prev) => [newEntry, ...prev]);
  };

  const addDocument = (doc: Omit<FarmDocument, 'id'>) => {
    const newDoc: FarmDocument = {
      ...doc,
      id: `doc-${Date.now()}`,
    };
    setDocuments((prev) => [newDoc, ...prev]);
  };

  const addToCart = (product: MarketplaceProduct, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { product, quantity: qty }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((acc, item) => {
    const discountedPrice = item.product.subsidyEligible
      ? item.product.price * (1 - item.product.subsidyDiscount / 100)
      : item.product.price;
    return acc + discountedPrice * item.quantity;
  }, 0);

  const logout = async () => {
    try {
      const token = localStorage.getItem('khetix_session_token');
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
    } catch (err) {
      console.warn('Logout server notification note:', err);
    } finally {
      setCurrentUser(null);
      localStorage.removeItem('khetix_user');
      localStorage.removeItem('khetix_session_token');
      setActiveModuleState('landing');
    }
  };

  return (
    <FarmContext.Provider
      value={{
        currentUser,
        authLoading,
        login,
        signup,
        requestPasswordReset,
        resetPassword,
        farms,
        activeFarm,
        hasFarms,
        setActiveFarmId,
        updateActiveFarm,
        addNewFarm,
        deleteFarm,
        activeModule,
        setActiveModule,
        soilMoistureOverride,
        setSoilMoistureOverride,
        rainProbabilityOverride,
        setRainProbabilityOverride,
        toggleFieldValve,
        notifications,
        unreadCount,
        markNotificationRead,
        markAllNotificationsRead,
        cart,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        cartTotal,
        orders,
        placeOrder,
        language,
        setLanguage,
        t,
        rawT,
        logout,
        quickActionTrigger,
        setQuickActionTrigger,
        todayPlan,
        togglePlanItem,
        todayTasks,
        toggleTodayTask,
        addTodayTask,
        calendarEvents,
        addCalendarEvent,
        toggleCalendarEvent,
        inventory,
        addInventoryItem,
        updateInventoryStock,
        expenses,
        addExpenseRecord,
        labour,
        updateWorkerAttendance,
        addWorker,
        journal,
        addJournalEntry,
        documents,
        addDocument,
      }}
    >
      {children}
    </FarmContext.Provider>
  );
};

export const useFarm = () => {
  const context = useContext(FarmContext);
  if (!context) {
    throw new Error('useFarm must be used within a FarmProvider');
  }
  return context;
};
