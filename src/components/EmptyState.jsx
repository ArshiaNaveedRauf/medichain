import CatLogo from "./CatLogo";

export default function EmptyState({ message = "Nothing here yet.", sub }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 animate-fade-in">
      <CatLogo size={120} desaturated />
      <p className="text-text-main font-semibold text-lg">{message}</p>
      {sub && <p className="text-muted text-sm text-center max-w-xs">{sub}</p>}
    </div>
  );
}
