{
    "targets": [
        {
            "target_name": "rapidxml",
            "cflags!": [ "-fno-exceptions" ],
            "sources": [ "rapidxml.cc", "pugixml/src/pugixml.cpp" ],
            "include_dirs": [
                "<!@(node -p \"require('node-addon-api').include\")"
            ],
            'defines': [ 'NAPI_DISABLE_CPP_EXCEPTIONS' ],
            'conditions': [
                ['OS=="mac"', {
                'xcode_settings': {
                    'GCC_ENABLE_CPP_EXCEPTIONS': 'YES'
                }
                }]
            ]
        }
    ]
}
