import {Composition} from 'remotion';
import {FortuneShape} from './video';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="FortuneShape"
    component={FortuneShape}
    durationInFrames={1260}
    fps={30}
    width={1280}
    height={720}
  />
);
