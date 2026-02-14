import { useState } from "react";
import Header from "./components/Header";
import CarCanvas from "./components/CarCanvas";
import "./App.css";

export default function App() {
  const cars = [
    "/models/2010_ford_shelby_gt500.glb",
    "/models/2015_ford_mustang_gt.glb",
    "/models/ford_mustang_1965.glb",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextCar = () => {
    setCurrentIndex((prev) => (prev + 1) % cars.length);
  };

  const prevCar = () => {
    setCurrentIndex((prev) => (prev === 0 ? cars.length - 1 : prev - 1));
  };

  return (
    <>
      <Header totalCars={cars.length} />
      <CarCanvas
        modelPath={cars[currentIndex]}
        nextCar={nextCar}
        prevCar={prevCar}
        activeIndex={currentIndex}
      />
    </>
  );
}
