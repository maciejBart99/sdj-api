module.exports = {
  name: 'ng-core-queued-track-application-services',
  preset: '../../../../../jest.config.js',
  coverageDirectory:
    '../../../../../coverage/libs/ng/core/queued-track/application-services',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};