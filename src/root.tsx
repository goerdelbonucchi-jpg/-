import {Composition} from 'remotion';
import {FortuneShape} from './video';
import {TopStudentSample} from './top-student-sample';
import {TopStudentPartTwo, PART_TWO_DURATION} from './top-student-part-two';
import {TopStudentPartThree, PART_THREE_DURATION} from './top-student-part-three';
import {TopStudentPartFour, PART_FOUR_DURATION} from './top-student-part-four';
import {TopStudentPartFive, PART_FIVE_DURATION} from './top-student-part-five';

import {TopStudentPartSix, PART_SIX_DURATION} from './top-student-part-six';

import {TopStudentPartSeven, PART_SEVEN_DURATION} from './top-student-part-seven';

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
    <Composition id="TopStudentPartFour" component={TopStudentPartFour} durationInFrames={PART_FOUR_DURATION} fps={30} width={1920} height={1080}/>
    <Composition id="TopStudentPartFive" component={TopStudentPartFive} durationInFrames={PART_FIVE_DURATION} fps={30} width={1920} height={1080}/>
    <Composition id="TopStudentPartSix" component={TopStudentPartSix} durationInFrames={PART_SIX_DURATION} fps={30} width={1920} height={1080}/>
    <Composition id="TopStudentPartSeven" component={TopStudentPartSeven} durationInFrames={PART_SEVEN_DURATION} fps={30} width={1920} height={1080}/>
  </>
);
