export default function Header({ totalCars }) {
  return (
    <div className="header">
      <h1>3D Car Showroom</h1>
      <div className="menu">Total Cars: {totalCars}</div>
    </div>
  );
}
