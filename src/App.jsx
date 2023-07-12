import { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import './index.css';

ChartJS.register( CategoryScale, LinearScale, BarElement, Title, Tooltip );

// these are helper functions to setup the charts using the chartJS library
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

/*
function gets all words in a string
regex pattern finds the following substrings:
not punctuation + not digit + not whitespace => makes up a word
all occurrences => return all matching results
unicode matching => support different languages
it is also consecutive (meaning it checks previous characters,
which returns words because they are made of letters next to each other) */
function getAllWords(str) {
	return [...str.toLowerCase().matchAll(/[^\p{P}\d\s]+/gu)].map(word => word[0]);
}

// function gets a string and returns an array with the amounts of appearances of each letter in the string
function countLetters(str) {
	/* regex pattern:
	not punctuation + not digit + not whitespace => only letters
	all occurrences => return all matching results
	unicode matching => support different languages */
	const result = {};
	// gets all letters. same as getAllWords() but not consecutive
	(str.toLowerCase().match(/[^\p{P}\d\s]/gu) || [])
		.forEach(char => result[char] = (result[char] || 0) + 1); // histograma. increment each letter's value in the object
	return result;
}

// function gets a string and returns an array with the amounts of appearences of each word in the string
function countWords(str) {
	const result = {};
	// histograma. increment each letter's value in the object
	getAllWords(str).forEach(word => result[word] = (result[word] || 0) + 1);
	return result;
}

// function gets a string and returns the amount of words in the string with duplicate letters in them
function countDuplicateWords(str) {
	const wordList = getAllWords(str);
	return wordList.filter(word => {
		console.log(word);
		const letters = word.split(''); // gets all letters
		// a set eleminates any duplicate elements from the original array.
		// if there were duplicates, they'd be removed and the length of the letters set would be changed
		return (new Set(letters)).size !== letters.length;
	}).length;
}

function App() {
	const [text, setText] = useState('');
	const [history, setHistory] = useState([]);

	useEffect(() => {
		document.querySelector('#inText').value = text;
	}, [text, history]);

	const handleInputSubmit = (e) => {
		if (e.key !== 'Enter') return; // accept input when user presses enter
		if (e.target.value.trim() === '') return; // check if value isnt empty

		// history shouldn't contain duplicate entries
		if (!history.includes(e.target.value)) {
			const newHistory = [e.target.value, ...history];
			if (newHistory.length > 15) newHistory.pop(); // we clamp the history to 15 entries
			setHistory(newHistory); // we add the new entry to the history
		}

		// we load the stats of the specified entry
		setText(e.target.value);
	};

	const deleteFromHistory = (e, index) => {
		e.preventDefault();
		setHistory(history.filter((_, i) => i !== index)); // we filter out the specified entry from the history
	}

	return (
		<div id='app'>
			<ul>
				<h2>Input History</h2>
				{history.map((entry, index) => (
					<li key={index}
						onClick={() => setText(entry)} // load an entry from the history on left click
						onContextMenu={e => deleteFromHistory(e, index)} // remove an entry from the history on right click
					>
						{entry}
					</li>
				))}
			</ul>
			<div>
				<input id='inText' onKeyDown={handleInputSubmit} />
				<Chart title='Letter Usage' data={countLetters(text)} />
				<Chart title='Word Usage' data={countWords(text)} />
				<p>Found {countDuplicateWords(text)} words with duplicate letters</p>
			</div>
			<div>
				<h2>How to use:</h2>
				<p>
					To use this tool, enter a sentence in the input box above the charts.<br /><br />
					Press Enter to submit the text.
					The page will tally the words, letters and words with duplicate letters in your sentence,
					and display the results in the middle section of this webpage.<br /><br />
					Use the list on the right of this webpage (your input history)
					to access up to 15 prompts you've submitted previously.<br /><br />
					Left click on an entry in your history to load it, or right click on it to delete it.
				</p>
			</div>
		</div>
	);
}

export default App;
