import { DireflowComponent } from 'direflow-component';
import ConverterV2 from './App';

export default DireflowComponent.create({
  component: ConverterV2,
  configuration: {
    tagname: 'v2-converter',
    useShadow: false,
  },
  plugins: [
    {
      name: 'font-loader',
      options: {
        google: {
          families: ['Advent Pro', 'Noto Sans JP'],
        },
      },
    },
  ],
});
