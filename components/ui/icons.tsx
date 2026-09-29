import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Bell,
  Blocks,
  Briefcase,
  BriefcaseBusiness,
  BuildingComplex,
  CalendarClock,
  CalendarDays,
  ChartNoAxesColumn,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  CircleDashed,
  CircleDot,
  CircleQuestionMark,
  ClipboardCheck,
  ClipboardList,
  Clock,
  CloudCheck,
  CodeXml,
  Compass,
  CornerDownLeft,
  Download,
  Ellipsis,
  ExternalLink,
  FileImage,
  FilePenLine,
  FileStack,
  FileText,
  FolderKanban,
  FolderPlus,
  FolderX,
  Gauge,
  Gem,
  Globe,
  Hourglass,
  House,
  ImageOff,
  Images,
  Inbox,
  Info,
  Layers,
  LayoutDashboard,
  LayoutTemplate,
  ListChecks,
  ListPlus,
  LoaderCircle,
  Lock,
  LogIn,
  LogOut,
  Mail,
  Megaphone,
  Menu,
  MessageSquare,
  Milestone,
  Monitor,
  MonitorSmartphone,
  OctagonAlert,
  Palette,
  Paperclip,
  Pencil,
  PenTool,
  Phone,
  Plus,
  Puzzle,
  RefreshCw,
  Rocket,
  RotateCcwClock,
  Scale,
  Search,
  Send,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Sparkles,
  SquareCheckBig,
  Star,
  StickyNote,
  Tag,
  Target,
  Trash,
  TriangleAlert,
  Upload,
  UserCheck,
  UserPlus,
  UserRound,
  Users,
  Workflow,
  Wrench,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * ViperByte icon registry — the only module that imports from lucide-react
 * (enforced by ESLint). Every key is a *concept*, and each concept has exactly
 * one icon, so the same idea always looks the same everywhere.
 *
 * Size and stroke come from globals.css: every icon is 20px with a 1.75 stroke
 * by default; feature tiles and empty states use 24px (`size-6`).
 * See .claude/skills/icon-system/SKILL.md for the full rules.
 */
export const Icons = {
  // Navigation & controls
  menu: Menu,
  close: X,
  back: ArrowLeft,
  forward: ArrowRight,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  chevronDown: ChevronDown,
  external: ExternalLink,
  search: Search,
  enter: CornerDownLeft,
  more: Ellipsis,
  /** Control glyph only: checkbox ticks and completed timeline steps. */
  check: Check,

  // Actions
  add: Plus,
  edit: Pencil,
  delete: Trash,
  upload: Upload,
  download: Download,
  send: Send,
  attach: Paperclip,
  loading: LoaderCircle,
  saved: CloudCheck,
  login: LogIn,
  logout: LogOut,
  signup: UserPlus,

  // Places in the product
  home: House,
  dashboard: LayoutDashboard,
  project: FolderKanban,
  newProject: FolderPlus,
  projectMissing: FolderX,
  requirements: ClipboardList,
  requirementsApproved: ClipboardCheck,
  tasks: SquareCheckBig,
  newTask: ListPlus,
  files: FileStack,
  document: FileText,
  image: FileImage,
  images: Images,
  imageMissing: ImageOff,
  messages: MessageSquare,
  design: Palette,
  activity: Activity,
  notes: StickyNote,
  notifications: Bell,
  settings: Settings,
  account: UserRound,
  clients: Users,
  clientConverted: UserCheck,
  leads: Inbox,
  portfolio: Briefcase,
  services: Layers,
  solutions: Blocks,
  pricing: Tag,
  help: CircleQuestionMark,
  info: Info,
  email: Mail,
  phone: Phone,
  process: Workflow,
  business: BuildingComplex,
  privacy: ShieldCheck,
  /** Padlock in browser address bars and secure-checkout hints. */
  secure: Lock,
  terms: Scale,
  website: Globe,
  pipeline: ChartNoAxesColumn,

  // Status
  success: CircleCheck,
  approved: BadgeCheck,
  current: CircleDot,
  upcoming: CircleDashed,
  waiting: Hourglass,
  warning: TriangleAlert,
  error: CircleAlert,
  blocked: OctagonAlert,
  revision: RefreshCw,
  recommended: Star,

  // Time
  date: CalendarDays,
  due: CalendarClock,
  time: Clock,
  history: RotateCcwClock,
  timeline: Milestone,

  // Studio, process and values (marketing)
  ai: Sparkles,
  scope: FilePenLine,
  checklist: ListChecks,
  discover: Compass,
  develop: CodeXml,
  launch: Rocket,
  quality: Gem,
  goals: Target,
  features: Puzzle,
  performance: Gauge,
  crossPlatform: MonitorSmartphone,

  // Service types (also selectable in the admin service editor)
  web: Monitor,
  mobile: Smartphone,
  uiDesign: PenTool,
  ecommerce: ShoppingCart,
  customBusiness: BriefcaseBusiness,
  template: LayoutTemplate,
  marketing: Megaphone,
  maintenance: Wrench,
} satisfies Record<string, LucideIcon>;

export type IconKey = keyof typeof Icons;
export type { LucideIcon };

const TILE_SIZES = {
  /** 32px tile, 20px icon — inline with small headings and list rows. */
  sm: "size-8 rounded-lg",
  /** 40px tile, 20px icon — cards, page headings, steps. */
  md: "size-10 rounded-xl",
  /** 48px tile, 24px icon — feature cards and empty states. */
  lg: "size-12 rounded-2xl [&_svg]:size-6",
} as const;

const TILE_TONES = {
  accent: "bg-accent-subtle text-accent ring-1 ring-inset ring-accent-border/60",
  solid: "bg-accent text-accent-foreground shadow-xs",
  success: "bg-success-subtle text-success ring-1 ring-inset ring-success-border",
  neutral: "bg-subtle text-muted",
  /** No fill until hovered — idle sidebar items. */
  ghost: "text-faint",
  danger: "bg-danger-subtle text-danger ring-1 ring-inset ring-danger-border",
  inverse: "bg-white/10 text-white ring-1 ring-inset ring-white/15",
} as const;

/**
 * The one icon container used across the site and apps. Decorative: the
 * adjacent text carries the meaning. With `interactive`, it fills with the
 * accent colour when its `group` parent is hovered or focused.
 */
export function IconTile({
  icon: Icon,
  size = "md",
  tone = "accent",
  interactive,
  className,
}: {
  icon: LucideIcon;
  size?: keyof typeof TILE_SIZES;
  tone?: keyof typeof TILE_TONES;
  interactive?: boolean;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center transition-colors duration-200 ease-out",
        TILE_SIZES[size],
        TILE_TONES[tone],
        interactive &&
          "group-hover:bg-accent group-hover:text-accent-foreground group-hover:ring-accent group-focus-visible:bg-accent group-focus-visible:text-accent-foreground group-focus-visible:ring-accent",
        className,
      )}
    >
      <Icon />
    </span>
  );
}
