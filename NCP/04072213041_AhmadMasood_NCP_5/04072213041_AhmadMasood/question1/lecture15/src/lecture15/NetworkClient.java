package lecture15;

import java.io.*;
import java.net.*;

public class NetworkClient {
    protected String host;
    protected int port;

    public NetworkClient(String host, int port) {
        this.host = host;
        this.port = port;
    }

    public String getHost() { return host; }
    public int getPort() { return port; }

    public void connect() {
        try (Socket client = new Socket(host, port)) {
            handleConnection(client);
        } catch (UnknownHostException uhe) {
            System.out.println("Unknown host: " + host);
            uhe.printStackTrace();
        } catch (IOException ioe) {
            System.out.println("IOException: " + ioe);
            ioe.printStackTrace();
        }
    }

    protected void handleConnection(Socket client) throws IOException {
        PrintWriter out = SocketUtil.getPrintWriter(client);
        BufferedReader in = SocketUtil.getBufferedReader(client);

        // Just reads one line from server (server must send newline terminated output)
        System.out.println("Generic Network Client:\nMade connection to " + host +
                " and got '" + in.readLine() + "' in response");
    }
}
