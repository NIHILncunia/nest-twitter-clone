import React, { useCallback } from 'react';
import { css } from '@emotion/react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { ChangeWord } from '@/reducers/TestReducer';

const IndexPage = () => {
  const word = useSelector((state: RootState) => state.test.word);
  const dispatch = useDispatch<AppDispatch>();

  const onClickButton = useCallback(() => {
    dispatch(ChangeWord());
  }, [ word, ]);

  const style = css`
    padding: 10px;
    background-color: #333333;
    color: #ffffff;
    margin-bottom: 10px;
  `;

  return (
    <>
      <div css={style}>Hello {word}!!</div>
      <button type='button' onClick={onClickButton}>
        클릭해서 변경
      </button>
    </>
  );
};

export default IndexPage;
