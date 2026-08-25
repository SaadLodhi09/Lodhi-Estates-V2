export function ListingCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[4/5] w-full bg-line/50" />
      <div className="mt-5 h-5 w-3/4 bg-line/50" />
      <div className="mt-2 h-4 w-1/2 bg-line/50" />
      <div className="mt-3 h-3 w-2/3 bg-line/50" />
    </div>
  );
}
