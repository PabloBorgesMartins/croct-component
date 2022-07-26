import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: 2rem;
  background: var(--gray-100);
  border: 1px dashed var(--gray-300);
`;


export const Display = styled.div`
  width: 400px;
  height: 400px;

  img{
    width: 400px;
    height: 400px;
  }
`;