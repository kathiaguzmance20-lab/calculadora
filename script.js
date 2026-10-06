const display = document.querySelector('#display');
const expression = document.querySelector('#expression');
let current = '0';
let stored = null;
let operator = null;
let replaceCurrent = false;
let justCalculated = false;
function render() { display.textContent = current; expression.textContent = stored === null ? ' ' : ` ${stored} ${operator || ''}`; }
function inputDigit(digit) {
  if (replaceCurrent || justCalculated) { current = digit; replaceCurrent = false; justCalculated = false; }
  else if (current === '0') current = digit;
  else if (current.replace('-', '').replace('.', '').length < 12) current += digit;
  render();
}
function inputDecimal() {
  if (replaceCurrent || justCalculated) { current = '0'; replaceCurrent = false; justCalculated = false; }
  if (!current.includes('.')) current += '.';
  render();
}
function calculate(a, b, op) {
  if (op === '+') return a + b;
  if (op === '−') return a - b;
  if (op === '×') return a * b;
  if (op === '÷') return b === 0 ? null : a / b;
  return b;
}
function format(value) {
  if (value === null || !Number.isFinite(value)) return 'Error';
  return String(Number(value.toPrecision(12))).slice(0, 15);
}
function chooseOperator(next) {
  const value = Number(current);
  if (operator && stored !== null && !replaceCurrent) { const result = calculate(stored, value, operator); current = format(result); stored = result; }
  else stored = value;
  operator = next; replaceCurrent = true; justCalculated = false; render();
}
function equals() {
  if (operator === null || stored === null) return;
  const result = calculate(stored, Number(current), operator);
  expression.textContent = `${stored} ${operator} ${current} =`;
  current = format(result); stored = null; operator = null; replaceCurrent = true; justCalculated = true; renderResult();
}
function renderResult() { display.textContent = current; }
function clear() { current = '0'; stored = null; operator = null; replaceCurrent = false; justCalculated = false; render(); }
function act(action) {
  if (action === 'clear') clear();
  if (action === 'delete') { if (!replaceCurrent && !justCalculated) current = current.length > 1 ? current.slice(0, -1) : '0'; render(); }
  if (action === 'decimal') inputDecimal();
  if (action === 'sign') { if (current !== '0' && current !== 'Error') current = current.startsWith('-') ? current.slice(1) : `-${current}`; render(); }
  if (action === 'percent' && current !== 'Error') { current = format(Number(current) / 100); render(); }
  if (action === 'equals') equals();
}
document.querySelector('.keys').addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.dataset.digit !== undefined) inputDigit(button.dataset.digit);
  if (button.dataset.operator) chooseOperator(button.dataset.operator);
  if (button.dataset.action) act(button.dataset.action);
});
document.querySelector('.theme-toggle').addEventListener('click', () => document.documentElement.classList.toggle('dark'));
document.addEventListener('keydown', event => {
  if (/^[0-9]$/.test(event.key)) inputDigit(event.key);
  else if (event.key === '.' || event.key === ',') inputDecimal();
  else if (event.key === 'Enter' || event.key === '=') { event.preventDefault(); equals(); }
  else if (event.key === 'Backspace') act('delete');
  else if (event.key === 'Escape') clear();
  else if (event.key === '+') chooseOperator('+');
  else if (event.key === '-') chooseOperator('−');
  else if (event.key === '*') chooseOperator('×');
  else if (event.key === '/') { event.preventDefault(); chooseOperator('÷'); }
});
render();
