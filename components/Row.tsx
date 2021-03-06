import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { Record } from '../utils/types';
import { Group, Stack } from '@mantine/core';
import styles from '../styles/Home.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
  faChevronUp,
  faFilePdf,
} from '@fortawesome/free-solid-svg-icons';

const Row: React.FC<{
  open: boolean[];
  setOpen: React.Dispatch<React.SetStateAction<boolean[]>>;
  index: number;
  el: Record;
}> = ({ open, setOpen, el, index }) => {
  const [show, setShow] = useState<boolean>(false);
  const cell = useRef<HTMLTableRowElement>(null);
  const checker = useRef(0);

  const handleResize = () => {
    checker.current = 0;
    const rowHeight: number | undefined = cell.current?.offsetHeight;
    if (cell.current?.children[1].firstChild?.nodeName === 'DIV') {
      setShow(!!(rowHeight && rowHeight > 90 && cell.current));
    } else {
      checker.current = checker.current + 1;
      setShow(false);
    }
  };

  useEffect(() => {
    if(checker.current === 1) {
      handleResize();
    }
  }, [show])

  useEffect(() => {
    const rowHeight: number | undefined = cell.current?.offsetHeight;
    setShow(!!(rowHeight && rowHeight > 90 && cell.current));

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <tr ref={cell} key={el.id}>
      <td>${el.salary.toLocaleString()}</td>
      <td>
        {show && (
          <button
            className={styles.expandCollapseButton}
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
              e.stopPropagation();
              setOpen((prev): boolean[] => {
                const currentStatus: boolean = prev[index];
                const wantedStates: boolean[] = [];
                wantedStates[index] = !currentStatus;
                return wantedStates;
              });
            }}
          >
            Documents{' '}
            <FontAwesomeIcon
              style={{ marginLeft: '5px' }}
              icon={open[index] ? faChevronUp : faChevronDown}
            />
          </button>
        )}
        {!show && (
          <Group className={styles.group}>
            {el.documents.map((el) => (
              <div className={styles.document} key={el.id}>
                <FontAwesomeIcon
                  className={styles.groupFile}
                  icon={faFilePdf}
                />
                {el.name}
              </div>
            ))}
          </Group>
        )}
        {show && open[index] && (
          <Stack
            style={{
              position: 'absolute',
              backgroundColor: 'white',
              border: '1px solid rgb(190, 186, 186)',
              padding: '10px',
              maxHeight: '200px',
              overflow: 'auto',
            }}
            className={styles.stack}
          >
            {el.documents.map((el) => (
              <div className={styles.menuItem} key={el.id}>
                <FontAwesomeIcon
                  style={{
                    marginRight: '5px',
                    color: 'rgb(190, 186, 186)',
                  }}
                  icon={faFilePdf}
                />
                {el.name}
              </div>
            ))}
          </Stack>
        )}
      </td>
    </tr>
  );
};

export default Row;
