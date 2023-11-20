import * as React from 'react';
import { unstable_useNumberInput as useNumberInput } from '@mui/base/unstable_useNumberInput';
import { styled } from '@mui/system';
import { unstable_useForkRef as useForkRef } from '@mui/utils';
import ArrowDropUpRoundedIcon from '@mui/icons-material/ArrowDropUpRounded';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';

const CompactNumberInput = React.forwardRef(function CompactNumberInput(
    { minValue = -Infinity, maxValue = Infinity, ...props },
    ref
) {
    const {
        getRootProps,
        getInputProps,
        getIncrementButtonProps,
        getDecrementButtonProps,
    } = useNumberInput({
        ...props,
        onIncrement: (val) => val < maxValue && props.onIncrement(val),
        onDecrement: (val) => val > minValue && props.onDecrement(val),
    });

    const inputProps = getInputProps();
    inputProps.ref = useForkRef(inputProps.ref, ref);

    return (
        <StyledInputRoot {...getRootProps()}>
            <StyledStepperButton
                className="increment"
                {...getIncrementButtonProps()}
                sx={{
                    height: '20px',
                }}
            >
                <ArrowDropUpRoundedIcon />
            </StyledStepperButton>
            <StyledStepperButton
                className="decrement"
                {...getDecrementButtonProps()}
                sx={{
                    height: '20px',
                }}
            >
                <ArrowDropDownRoundedIcon />
            </StyledStepperButton>
            <HiddenInput {...inputProps} />
        </StyledInputRoot>
    );
});

export default function UseNumberInputCompact(props) {
    const [value, setValue] = React.useState(9 - props.index);

    return (
        <Layout>
            <CompactNumberInput
                aria-label="Compact number input"
                placeholder="Type a number…"
                readOnly
                value={value}
                onChange={(event, val) => {
                    if(val >= 0 && val <= 9 ){
                        setValue(val);
                        props.callback(props.courseCode ,9-val)
                    } }}
            />
            
        </Layout>
    );
}


const blue = {
    100: '#DAECFF',
    200: '#80BFFF',
    400: '#3399FF',
    500: '#007FFF',
    600: '#0072E5',
    700: '#0059B2',
};

const grey = {
    50: '#F3F6F9',
    100: '#E5EAF2',
    200: '#DAE2ED',
    300: '#C7D0DD',
    400: '#B0B8C4',
    500: '#9DA8B7',
    600: '#6B7A90',
    700: '#434D5B',
    800: '#303740',
    900: '#1C2025',
};

const StyledInputRoot = styled('div')(
    ({ theme }) => `
    display: grid;
    grid-template-columns: none;
    grid-template-rows: none;
    grid-template-areas:
      "increment"
      "decrement";
    row-gap: 0;
    height:40px;
    overflow: auto;
    border-radius: 8px;
    border-style: solid;
    border-width: 1px;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    border-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[200]};
    box-shadow: 0px 2px 4px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0, 0.5)' : 'rgba(0,0,0, 0.05)'
        };
  `,
);

const HiddenInput = styled('input')`
  visibility: hidden;
  position: absolute;
`;

const StyledStepperButton = styled('button')(
    ({ theme }) => `
  display: flex;
  flex-flow: nowrap;
  justify-content: center;
  align-items: center;
  font-size: 0.5rem;
  box-sizing: border-box;
  border: 0;
  padding: 0;
  color: inherit;
  background: ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};

  &:hover {
    cursor: pointer;
    background: ${theme.palette.mode === 'dark' ? blue[700] : blue[500]};
    color: ${grey[50]};
  }

  &:focus-visible {
    outline: 0;
    box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[700] : blue[200]};
  }

  &.increment {
    grid-area: increment;
  }

  &.decrement {
    grid-area: decrement;
  }
`,
);

const Layout = styled('div')`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  column-gap: 1rem;
`;

const Pre = styled('pre')`
  font-size: 0.75rem;
`;