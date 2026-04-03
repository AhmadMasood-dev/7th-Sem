package lecture15;

import java.io.*;
import java.net.*;

public class SocketUtil {
    public static BufferedReader getBufferedReader(Socket s) throws IOException {
        return new BufferedReader(new InputStreamReader(s.getInputStream()));
    }

    public static PrintWriter getPrintWriter(Socket s) throws IOException {
        return new PrintWriter(s.getOutputStream(), true);
    }
}
