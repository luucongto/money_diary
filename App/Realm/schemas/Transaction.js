const schema = {
  name: 'Transaction',
  primaryKey: 'id',
  properties: {
    id: { type: 'int', default: 0 },
    amount: { type: 'int', default: 0 },
    note: { type: 'string', default: '' },
    date: 'date',
    category: { type: 'int', default: 0 },
    wallet: { type: 'int', default: 0 },
    event: { type: 'string', default: '' },
    include: { type: 'bool', default: true }
  }
}

export default schema
