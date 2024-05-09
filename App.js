import React, { useReducer } from 'react';
import './App.css';
import "./styles.css";
import DigitButton from './DigitButton';
import OperandButton from './OperandButton';

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  CHOOSE_OPERATION: 'choose-operation',
  EVALUATE: 'evaluate'
}

function reducer(state, { type, payload }) {
  switch(type) {
    case ACTIONS.ADD_DIGIT:
    if(state.overwrite)
      {
        return{
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        }
      }

    if(payload.digit === "0" && state.currentOperand === "0") return state
    if(payload.digit === "." && state.currentOperand.includes(".")) return state

      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}` // Fix template literal usage
      };

      case ACTIONS.CLEAR:
      return{}

    case ACTIONS.DELETE_DIGIT:
      if(state.overwrite)
        {
          return{
            ...state,
            overwrite: false,
            currentOperand: ''
          }
        }
        if(state.currentOperand === '') return state
        if(state.currentOperand.length === 1)
          {
            return{...state, currentOperand: ''}
          }
        
        return{
          ...state,
          currentOperand: state.currentOperand.slice(0, -1)
        }

    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand === '' && state.previousOperand === '') {
        return state; // If both currentOperand and previousOperand are empty, do nothing
      } 
      if (state.previousOperand === '') {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: '', // Reset currentOperand for entering the next number
        };
      }
      if (state.currentOperand === '') {
        return {
          ...state,
          operation: payload.operation,
        };
      }
    
      return {
        ...state,
        previousOperand: evaluate(state), // Evaluate the expression so far
        operation: payload.operation,
        currentOperand: '', // Reset currentOperand for entering the next number
      };
        
    
    case ACTIONS.EVALUATE:
      if(state.operation === '' || state.current === '' || state.previousOperand === '')
        {
          return state
        }

      return{
        ...state,
        overwrite: true,
        previousOperand: '',
        operation: '',
        currentOperand: evaluate(state),
      }
    default:
      return state;

    
  }
}

function evaluate({currentOperand, previousOperand, operation})
{
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
  if(isNaN(prev) || isNaN(current)) return ""
  let computation = ""
  switch(operation)
  {
    case "+":
      computation = prev + current
      break
    case "-":
      computation = prev - current
      break
    case "*":
      computation = prev * current
      break
    case "÷":
      computation = prev / current
      break 
  }
  return computation.toString()
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0, 
})

function formatOperand(operand) {
  if (!operand || operand === '') return ''; // Check if operand is undefined or an empty string

  const [integer, decimal] = operand.split('.'); // Split operand into integer and decimal parts
  if (!decimal) return INTEGER_FORMATTER.format(integer); // If decimal part is undefined, format integer only
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`; // Format integer and decimal parts
}


function App() {
  const [state, dispatch] = useReducer(reducer, {
    currentOperand: '', // Initialize currentOperand
    previousOperand: '', // Initialize previousOperand
    operation: '' // Initialize operation
  });

  const { currentOperand, previousOperand, operation } = state;

  return (
    <div className='calculator-container'>
      <div className="calculator-grid">
      <div className='output'>
        <div className='previous-operand'>{formatOperand(previousOperand)}{operation}</div>
        <div className='current-operand'>{formatOperand(currentOperand)}</div>
      </div>
      <button className='span-two' onClick={() => dispatch({type: ACTIONS.CLEAR})}>AC</button>
      <button onClick={() => dispatch({type: ACTIONS.DELETE_DIGIT})}>DEL</button>

      <OperandButton operation="÷" dispatch={dispatch} />
      
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      
      <OperandButton operation="-" dispatch={dispatch} />

      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      
      <OperandButton operation="+" dispatch={dispatch} />

      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      
      <OperandButton operation="*" dispatch={dispatch} />

      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button className='span-two' onClick={() => dispatch({type: ACTIONS.EVALUATE})}>=</button>
    </div>
    </div>
  );
}

export default App;
