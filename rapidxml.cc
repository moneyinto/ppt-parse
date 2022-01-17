#include <napi.h>
#include "pugixml/src/pugixml.hpp"

void ToObject3(pugi::xml_node node, Napi::Object obj, Napi::Env env) {
    Napi::Object attributes = Napi::Object::New(env);
    for(pugi::xml_attribute attr : node.attributes()){
        std::string name = attr.name();
        std::string value = attr.value();
        attributes.Set(name, value);
    }
    obj.Set("attrs", attributes);
    obj.Set("name", node.name());
    obj.Set("value", node.value());
    
    Napi::Array children = Napi::Array::New(env);
    int i = 0;
    for(pugi::xml_node child : node.children()){
        Napi::Object cObj = Napi::Object::New(env);
        ToObject3(child, cObj, env);
        children.Set(i, cObj);
        i++;
    }
    obj.Set("children", children);
}

Napi::Object Method(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    std::string xmlString = info[0].As<Napi::String>();
    const char * xml = xmlString.c_str();
    pugi::xml_document doc;
    doc.load_string(xml, pugi::parse_ws_pcdata);
    Napi::Object res = Napi::Object::New(env);
    pugi::xml_node node = doc.first_child();
    ToObject3(node, res, env);
    return res;
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set(Napi::String::New(env, "parseString"), Napi::Function::New(env, Method));
    return exports;
}

NODE_API_MODULE(rapidxml, Init)
