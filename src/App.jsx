import { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import './index.css';

ChartJS.register( CategoryScale, LinearScale, BarElement, Title, Tooltip );

const createOptions = (text) => {
	return {
		responsive: true,
		plugins: { title: { display: true, text: text } }
	};
}
const createData = (text, obj) => ({
	labels: Object.keys(obj),
	datasets: [{
		label: text,
		data: Object.values(obj),
		backgroundColor: 'rgba(53, 162, 235, 0.5)',
	}]
});
function Chart({ title, data }) {
	return (
		<div className='chart'>
			<Bar options={createOptions(title)}
				data={createData(title, data)}
			/>
		</div>
	);
}

function countLetters(str) {
	/* regex pattern:
	not punctuation, not digit, not whitespace
	all occurrences, unicode matching */
	const result = {};
	(str.toLowerCase().match(/[^\p{P}\d\s]/gu) || [])
		.forEach(char => result[char] = (result[char] || 0) + 1);
	return result;
}
function countWords(str) {
	const result = {};
	/* same regex pattern but consecutive
	(meaning it checks previous characters,
	which returns words because they are made of letters next to each other) */
	[...str.toLowerCase().matchAll(/[^\p{P}\d\s]+/gu)]
		.forEach(([word]) => result[word] = (result[word] || 0) + 1);
	return result;
}

function App() {
	const [text, setText] = useState('');
	const [history, setHistory] = useState([]);

	useEffect(() => {
		document.querySelector('#inText').value = text;
	}, [text, history]);

	const handleInputSubmit = (e) => {
		if (e.key !== 'Enter') return;
		if (e.target.value.trim() === '') return;

		if (!history.includes(e.target.value)) {
			const newHistory = [e.target.value, ...history];
			if (newHistory.length > 15) newHistory.pop();
			setHistory(newHistory);
		}

		setText(e.target.value);
	};

	return (
		<>
			<div className='split left'>
				<input id='inText' onKeyDown={handleInputSubmit} />
				<Chart title='Letter Usage' data={countLetters(text)} />
				<Chart title='Word Usage' data={countWords(text)} />
			</div>
			<ul className='split right'>
				<h2>Input History</h2>
				{history.map((entry, index) => (
					<li key={index} onClick={() => setText(entry)}>
						{entry}
					</li>
				))}
			</ul>
		</>
	);
}

export default App;
