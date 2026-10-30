import type { MascotAssets } from '../types';

export function compatibleMascotRig(art: MascotAssets, mobile: boolean) {
  const colour = (mobile ? art.colour.responsive?.mobile : undefined) ?? art.colour.path;
  const sketch = (mobile ? art.sketch.responsive?.mobile : undefined) ?? art.sketch.path;
  return art.rig && colour === art.rig.sourceColourPath && sketch === art.rig.sourceSketchPath ? art.rig : null;
}
