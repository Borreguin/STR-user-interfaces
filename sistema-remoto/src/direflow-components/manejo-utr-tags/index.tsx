import { DireflowComponent } from 'direflow-component';
import App from './App';

export default DireflowComponent.create({
  component: App,
  configuration: {
    tagname: 'manejo-utr-tags',
    useShadow: true,
  },
  plugins: [
      {
      name: 'external-loader',
      options: {
        paths: [
          'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css'
        ],
      },
    }
  ],
});
