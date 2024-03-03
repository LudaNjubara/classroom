export default function GridView({ children }: { children: React.ReactNode }) {
  return <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{children}</section>;
}
