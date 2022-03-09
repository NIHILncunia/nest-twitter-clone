import React from 'react';
import { css } from '@emotion/react';
import AppLayout from '@/layouts/AppLayout';
import { useSiteMeta } from '@/hooks';

const IndexPage = () => {
  const IndexPageStyle = css``;

  const meta = useSiteMeta({
    title: '홈',
    url: '/',
  });

  return (
    <>
      <AppLayout meta={meta}>
        <div id='index-page' css={IndexPageStyle}>메인</div>
      </AppLayout>
    </>
  );
};

export default IndexPage;
