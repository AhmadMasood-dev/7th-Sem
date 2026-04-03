package lecture14;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.Map;

public class QueryString {
    private final Map<String, String> params = new LinkedHashMap<>();

    public void add(String name, String value) {
        params.put(name, value);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();

        for (Map.Entry<String, String> e : params.entrySet()) {
            if (sb.length() > 0) sb.append("&");
            sb.append(encode(e.getKey()));
            sb.append("=");
            sb.append(encode(e.getValue()));
        }
        return sb.toString();
    }

    private String encode(String s) {
        try {
            return URLEncoder.encode(s, StandardCharsets.UTF_8.name());
        } catch (UnsupportedEncodingException ex) {
        return s;
        }
    }
}
