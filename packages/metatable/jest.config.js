module.exports = {
    transform: {
        '.+\\.tsx?$': 'ts-jest',
    },
    testRegex: '\\.spec\\.tsx?$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    rootDir: 'src',
    snapshotSerializers: [
        "enzyme-to-json/serializer"
    ],
    setupFilesAfterEnv: ['./setupTests.ts'],
};
