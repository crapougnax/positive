import { Colors } from 'react-native-paper'

export const garbageTypes = [
  {
    label: 'Ordinaire',
    value: 'ordinary',
    icon: 'delete',
    color: Colors.red500,
  }, {
    label: 'Recyclable',
    value: 'recycle',
    icon: 'loop',
    color: Colors.orange500,

  },{
    label: 'Compostable',
    value: 'compost',
    icon: 'all-inclusive',
    color: Colors.green500,
  },{
    label: 'Verre',
    value: 'glass',
    icon: 'local-drink',
    color: Colors.green500,
  },
]
