export default function PageShell({ children }) {
  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "48px 32px 96px 32px",
      }}
    >
      {children}
    </div>
  );
}
