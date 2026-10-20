import {Composition} from 'remotion';
import {FortuneShape} from './video';
import {TopStudentSample} from './top-student-sample';
import {TopStudentPartTwo, PART_TWO_DURATION} from './top-student-part-two';
import {TopStudentPartThree, PART_THREE_DURATION} from './top-student-part-three';

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
    <Composition
      id="TopStudentPartTwo"
      component={TopStudentPartTwo}
      durationInFrames={PART_TWO_DURATION}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition id="TopStudentPartThree" component={TopStudentPartThree} durationInFrames={PART_THREE_DURATION} fps={30} width={1920} height={1080}/>
  </>
);
