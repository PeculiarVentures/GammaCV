import React from 'react';
import { Sidebar } from './sidebar';
import s from './index.module.sass';

interface IDocsPageProps {
  config: IDocGroup[];
  data: DocDataType;
}

export const DocsPage: React.FC<IDocsPageProps> = (props) => {
  const { config, data } = props;

  return (
    <>
      <Sidebar
        config={config}
      />

      <section
        className={s.root}
      >
        <div className={s.m_width}>
          {JSON.stringify(data)}
        </div>
      </section>
    </>
  );
};
