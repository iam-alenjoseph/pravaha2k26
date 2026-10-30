import type { Asset } from '../types';
import type { RefCallback } from 'react';

export function MascotRig({ sprite, variant, canvas, registerJoint }: { sprite: Asset; variant: 'colour' | 'sketch'; canvas: { width: number; height: number }; registerJoint: RefCallback<SVGGElement> }) {
  const part = (name: string) => <use href={`${sprite.path}#${name}-${variant}`} width={canvas.width} height={canvas.height} />;
  return <g data-mascot-variant={variant}>
    <g ref={registerJoint} data-mascot-joint="ribbon">{part('ribbon')}</g>
    {part('body')}
    <g ref={registerJoint} data-mascot-joint="left-shoulder">{part('left-sleeve')}<g ref={registerJoint} data-mascot-joint="left-wrist">{part('left-hand')}</g></g>
    <g ref={registerJoint} data-mascot-joint="right-shoulder">{part('right-sleeve')}<g ref={registerJoint} data-mascot-joint="right-wrist">{part('right-hand')}</g></g>
  </g>;
}
