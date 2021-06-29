import React, { FC, useContext } from 'react';
import { EventContext, Styled } from 'direflow-component';
import styles from './App.css';

interface IProps {
  componentTitle: string;
  sampleList: string[];
}

const App: FC<IProps> = (props) => {
  const dispatch = useContext(EventContext);

  const handleClick = () => {
    const event = new Event('my-event');
    dispatch(event);
  };

  const renderSampleList = props.sampleList.map((sample: string) => (
    <div key={sample} className='sample-text'>
      → {sample}
    </div>
  ));

  return (
    <Styled styles={styles}>
      <div className='app'>
        <div className='top'>
          <div className='header-image' />
        </div>
        <div className='bottom'>
          <div className='header-title'>{props.componentTitle}</div>
          <div>{renderSampleList}</div>
          <button className='button' onClick={handleClick}>
            Documentación
          </button>
        </div>
      </div>
    </Styled>
  );
};

App.defaultProps = {
  componentTitle: 'Sistema Central',
  sampleList: [
    'Componente creado en React (yarn start)',
    'Construido como Componente Web (yarn build)',
    'Compilado y usado en cualquier lugar (build/ComponentBundle.js)',
  ],
}

export default App;
