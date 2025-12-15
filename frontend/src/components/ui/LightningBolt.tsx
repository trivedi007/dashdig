interface LightningBoltProps {
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap = {
  xs: { width: 12, height: 16 },
  sm: { width: 14, height: 18 },
  md: { width: 20, height: 24 },
  lg: { width: 24, height: 28 },
  xl: { width: 28, height: 32 },
};

const LightningBolt = ({ size, className = '' }: LightningBoltProps) => {
  const { width, height } = sizeMap[size];

  return (
    <svg
      width={width}
      height={height}
      viewBox="-1 0 22 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M 6 2 L 17 2 L 13 10 L 19 10 L 3 30 L 7 18 L 1 18 Z"
        fill="#FFCC33"
        stroke="#1A1A1A"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
    </svg>
  );
};

export { LightningBolt };
export default LightningBolt;

