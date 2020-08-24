
const schema = {
  name: 'Wallet',
  primaryKey: 'id',
  properties: {
    id: { type: 'int', default: 0 },
    label: { type: 'string', default: '' },
    icon: { type: 'string', default: '' },
    color: { type: 'string', default: '' },
    amount: { type: 'int', default: 0 },
    income: { type: 'int', default: 0 },
    outcome: { type: 'int', default: 0 }
  }
}

export default schema
