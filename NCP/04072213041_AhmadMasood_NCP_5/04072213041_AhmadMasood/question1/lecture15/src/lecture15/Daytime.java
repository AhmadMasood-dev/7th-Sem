package lecture15;

import java.io.*;
import java.net.*;
import java.text.*;
import java.util.Date;

public class Daytime {

    public Date getDateFromNetwork() throws IOException, ParseException {
        try (Socket socket = new Socket("time.nist.gov", 13)) {
            socket.setSoTimeout(15000);

            InputStream in = socket.getInputStream();
            StringBuilder time = new StringBuilder();
            InputStreamReader reader = new InputStreamReader(in);

            for (int c = reader.read(); c != -1; c = reader.read()) {
                time.append((char) c);
            }
            return parseDate(time.toString());
        }
    }

    static Date parseDate(String s) throws ParseException {
        String[] pieces = s.trim().split("\\s+");
        if (pieces.length < 3) throw new ParseException("Unexpected time format: " + s, 0);

        String dateTime = pieces[1] + " " + pieces[2] + " UTC";
        DateFormat format = new SimpleDateFormat("yy-MM-dd HH:mm:ss z");
        return format.parse(dateTime);
    }

    public static void main(String[] args) {
        try {
            Daytime testtime = new Daytime();
            System.out.println(testtime.getDateFromNetwork());
        } catch (Exception e) {
            System.err.println(e);
        }
    }
}
