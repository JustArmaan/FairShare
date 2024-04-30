type Coordinate = {
  x: number;
  y: number;
};

function floatToCoords(float: number): Coordinate {
  const floatOffset = float + 0.75;
  const theta = 2 * Math.PI * (floatOffset === 0 ? 0 : floatOffset % 1); // get theta with offset such that 0 maps to [0.5, 0]
  console.log(float, floatOffset, theta);
  console.log(floatOffset % 1);
  const xPrime = Math.cos(theta);
  const yPrime = Math.sin(theta);

  const x = (xPrime + 1) / 2; // maps to [0, 1] from [-1, 1]
  const y = (yPrime + 1) / 2; // ^
  return { x, y };
}

function coordToStyleString({ x, y }: { x: number; y: number }) {
  return `${(x * 100).toFixed(2)}% ${(y * 100).toFixed(2)}%`;
}

function rangeToStyleString({ start, end }: { start: number; end: number }) {
  const startCoord = floatToCoords(start);
  const endCoord = floatToCoords(end);
  const middle = (end - start) / 2;

  const fillCoord = floatToCoords(middle);
  return `clip-path: polygon(50% 50%, ${coordToStyleString(startCoord)}, ${coordToStyleString(fillCoord)}, ${coordToStyleString(endCoord)})`;
}

type Props = {
  coords?: { start: number; end: number; color: string }[]; // todo remove ?
};

const sampleCoords = [
  { start: 0, end: 0.5, color: 'bg-accent-red' },
  { start: 0.5, end: 1, color: 'bg-accent-blue' },
  // { start: 0.8, end: 1, color: 'bg-accent-purple' },
];

export const PieChart = ({ coords }: Props) => {
  // challenge:
  // need to transform a value from 0-100 into a pie chart representation
  // we have an x-y coordinate system to use with clip path:
  // all polygons start with 50 50 as the middle point
  // then we define the radial start point, the corner filler point, and the radial end point

  return (
    <div class="bg-primary-grey rounded-full w-3/5 aspect-square overflow-hidden relative">
      {/* the inner square is larger than the circle 
          it is then clipped by the circle overflow hidden
          we then define triangles using clip path and polygon to
          create pie slices
          clip path is determined mathematically
          */}
      {sampleCoords.map((coord) => {
        return (
          <div
            class={`hover:opacity-80 transition-opacity absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${coord.color} w-[174%] h-[174%]`} // min size of rectange is radius*sqrt(3), or (sqrt(3)*100)%, or roughly 173.2%
            style={rangeToStyleString(coord)}
          ></div>
        );
      })}
    </div>
  );
};
