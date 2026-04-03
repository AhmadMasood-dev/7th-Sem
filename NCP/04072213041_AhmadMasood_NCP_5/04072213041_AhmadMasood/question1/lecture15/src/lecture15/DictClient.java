package lecture15;

import java.io.*;
import java.net.*;

public class DictClient {
    public static final String SERVER = "dict.org";
    public static final int PORT = 2628;
    public static final int TIMEOUT = 15000;

    public static void main(String[] args) {
        Socket socket = null;

        try {
            socket = new Socket(SERVER, PORT);
            socket.setSoTimeout(TIMEOUT);

            Writer writer = new BufferedWriter(new OutputStreamWriter(socket.getOutputStream()));
            BufferedReader reader = new BufferedReader(new InputStreamReader(socket.getInputStream()));

            String greeting = reader.readLine();
            if (greeting != null) System.out.println(greeting);

            for (String word : args) {
                define(word, writer, reader);
            }

            writer.write("quit\r\n");
            writer.flush();

        } catch (IOException ex) {
            System.err.println(ex);
        } finally {
            if (socket != null) {
                try { socket.close(); } catch (IOException ex) { }
            }
        }
    }

    static void define(String word, Writer writer, BufferedReader reader) throws IOException {
        writer.write("DEFINE fd-eng-lat " + word + "\r\n");
        writer.flush();

        for (String line = reader.readLine(); line != null; line = reader.readLine()) {
            if (line.startsWith("250 ")) {
                return;
            } else if (line.startsWith("552 ")) {
                System.out.println("No definition found for " + word);
                return;
            } else if (line.matches("\\d\\d\\d .*")) {
                continue;   
            } else if (line.trim().equals(".")) {
                continue;   
            } else {
                System.out.println(line);
            }
        }
    }
}
