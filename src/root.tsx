import {Composition} from 'remotion';
import {FortuneShape} from './video';
import {TopStudentSample} from './top-student-sample';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="FortuneShape"
      component={FortuneShape}
      durationInFrames={1260}
      fps={30}
      width={1280}
      height={720}
    />
    <Composition
      id="TopStudentSample"
      component={TopStudentSample}
      durationInFrames={1224}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
