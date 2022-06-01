import Transform from '@ember-data/serializer/transform';

export default class PhoneTransform extends Transform {
  deserialize(serialized) {
    console.log(serialized);
    return serialized;
  }

  serialize(deserialized) {
    console.log(deserialized);
    return deserialized;
  }
}
