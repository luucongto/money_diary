
const schema = {
  name: 'Wallet',
  primaryKey: 'id',
  properties: {
    id: { type: 'int', default: 0 },
    label: { type: 'string', default: '' },
    icon: { type: 'string', default: '' }
  }
}

export default schema
