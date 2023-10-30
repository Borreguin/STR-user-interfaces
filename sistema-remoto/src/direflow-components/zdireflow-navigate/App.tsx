import React, { FC } from 'react';
import { Styled } from 'direflow-component';
import styles from './App.css';
import { routes } from '../../index'
import { faDotCircle} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface IProps {
  componentTitle: string;
  sampleList: string[];
}

const App: FC<IProps> = (props) => {
  // const dispatch = useContext(EventContext);
  //
  // const handleClick = () => {
  //   const event = new Event('my-event');
  //   dispatch(event);
  // };

  // const renderSampleList = props.sampleList.map((sample: string) => (
  //   <div key={sample} className='sample-text'>
  //     → {sample}
  //   </div>
  // ));
  const create_links = () => {
    return (
      <li className="link-menu">
      {routes.map((item, ix) => (
        <a
          key={ix}
          href={item.path}
          className={"link-block" }
        >
          <FontAwesomeIcon
            icon={ faDotCircle }
            style={{ marginRight: "5px" }}
          />
          <span className="menu-text">{item.description}</span>
        </a>
      ))}
    </li>
    );
  }
  

  return (
    <Styled styles={styles}>
      <div className='app'>
        {create_links()}
      </div>
    </Styled>
  );
};

App.defaultProps = {
  componentTitle: 'Plantilla de Sistema Remoto',
  sampleList: [
    'Componente creado en React',
    'Construido como Componente Web',
    'Compilado y usado en cualquier lugar',
  ],
}

export default App;
