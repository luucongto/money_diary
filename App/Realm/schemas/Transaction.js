const schema = {
  name: 'Transaction',
  primaryKey: 'id',
  properties: {
    id: { type: 'int', default: 0 },
    amount: { type: 'int', default: 0 },
    note: { type: 'string', default: '' },
    date: 'date',
    category: { type: 'string', default: '' },
    wallet: { type: 'string', default: '' }
  }
}

export default schema
