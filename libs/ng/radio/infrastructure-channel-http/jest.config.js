module.exports = {
  name: 'ng-radio-infrastructure-channel-http',
  preset: '../../../../jest.config.js',
  coverageDirectory:
    '../../../../coverage/libs/ng/radio/infrastructure-channel-http',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};