const express = require('express');
const Database = require('better-sqlite3');
const app = express();
const db = new Database('combo.db', { verbose: console.log });

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
  const formData = getFormData()
  const divideBy = getDivideBy()
  res.render('index', 
    { 
      months: formData.map(x => x.month),
      suppliers: formData.map(x => x.supplier),
      multipliers: formData.map(x => x.multiplier),
      divideBy: divideBy.filter(x => x.id === 1)[0].divideBy
  })
})

app.put('/api/save', (req, res) => {
  /**
   * req body shape
   * @typedef {Object} Item
   * @property {string} field
   * @property {number} id
   * @property {number} value
   */

  /**
   * @type {Item[]}
   */
  const body = req.body

  body.forEach(item => {
    if (item.field == 'divideBy') updateDivideBy(item)
    else updateFormData(item)
  })
  
})

app.get('/api/get', async (req, res) => {
  const formData = getFormData()
  prettyPrint(formData)
  res.send(formData)
})

app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
})

/**
 * @param {Object} payload
 * @returns {void}
 * @description pretty prints the payload
 */
function prettyPrint(payload) {
  d = JSON.stringify(payload)
  d = d.replace(/\[/g, '[\n')
  d = d.replace(/{/g, '  {')
  d = d.replace(/}]/g, '\n  }\n]')
  d = d.replace(/{"/g, '{\n    "')
  d = d.replace(/,"/g, ',\n    "')
  d = d.replace(/},/g, '\n  },\n')
  d = d.replace(/:/g, ': ')
  return console.log(d)
}

/**
 * @returns {Array<{id: number, month: string, supplier: number, multiplier: number}>}
 */
function getFormData() {
  const q = 'SELECT * FROM formData'
  const stmt = db.prepare(q)
  const formData = stmt.all()
  return formData
}

/**
 * @returns {Array<{id: number, divideBy: number}>}
 */
function getDivideBy() {
  const q = 'SELECT * FROM divideBy'
  const stmt = db.prepare(q)
  const divideBy = stmt.all()
  return divideBy
}

/**
 * @param {Item} item 
 * @returns {void}
 */
function updateFormData(item) {
  const q = `UPDATE formData SET ${item.field} = ? WHERE id = ?`
  const stmt = db.prepare(q)
  stmt.run(item.value, item.id)
}

/**
 * @param {Item} item 
 * @returns {void}
 */
function updateDivideBy(item) {
  const q = `UPDATE divideBy SET divideBy = ? WHERE id = ?`
  const stmt = db.prepare(q)
  stmt.run(item.value, item.id)
}