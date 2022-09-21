import React, { useEffect, useRef } from 'react';

interface IProps {
  columnWidthSum: number;
  isResizable?: boolean;
}

const MIN_COL_WIDTH = 120;

export const useResizableTableStyles = ({ isResizable, columnWidthSum }: IProps) => {
    const ref = useRef(null);
    const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);

    const scroll = () => {
        if (ref.current) {
            const scrollW = ref.current.querySelector('.ant-table').scrollWidth;
            const scrollLeft = ref.current.querySelector('.ant-table').scrollLeft;
            const width = ref.current.offsetWidth;

            if (width + scrollLeft >= scrollW) {
                ref.current.style['boxShadow'] = 'none';
                ref.current.style['paddingRight'] = '0';
            } else {
                ref.current.style['boxShadow'] = 'inset -6px 0px 7px -7px rgba(0, 0, 0, 0.8)';
                ref.current.style['paddingRight'] = '5px';
            }
        }
    };

    useEffect(() => {
        if (ref.current && isResizable) {
            ref.current.querySelector('.ant-table').addEventListener('scroll', scroll);

            return () => {
                ref?.current?.querySelector('.ant-table').removeEventListener('scroll', scroll);
            };
        }
    }, [isResizable]);

    useEffect(() => {
        if (ref.current && isResizable) {
            const maxW = ref.current.offsetWidth;

            // Move to styled component
            ref.current.querySelector('table').style['width'] = Math.max(columnWidthSum + MIN_COL_WIDTH, maxW) + 'px';
            if (columnWidthSum + MIN_COL_WIDTH > maxW) {
                ref.current.style['boxShadow'] = 'inset -6px 0px 7px -7px rgba(0, 0, 0, 0.8)';
                ref.current.style['paddingRight'] = '5px';
            } else {
                ref.current.style['boxShadow'] = 'none';
                ref.current.style['paddingRight'] = '0';
            }
        }
    }, [columnWidthSum, windowWidth]);

    useEffect(() => {
        if (isResizable) {
            const widthChanged = () => {
                setWindowWidth(window.innerWidth);
            };

            window.addEventListener('resize', widthChanged);

            return () => {
                window.removeEventListener('resize', widthChanged);
            };
        }
    }, [isResizable]);

    return {
        ref,
    };
};
