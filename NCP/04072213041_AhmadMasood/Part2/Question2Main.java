import java.util.concurrent.ExecutionException;

public class Question2Main {

    public static void main(String[] args) {
        String filename = "numbers.txt";
        int count = 1000;
        int minValue = 1;
        int maxValue = 10000;
        int threadCount = 5;

        // a) Generate random numbers to file using character stream
        RandomNumberGenerator.generateToFile(filename, count, minValue, maxValue);

        // b) Read numbers from file into array
        int[] data = NumberFileReader.readFromFile(filename);
        if (data.length == 0) {
            System.out.println("No data to process. Exiting...");
            return;
        }

        // c) Find min using multithreading (5 threads)
        long startMulti = System.nanoTime();
        int minMulti;
        try {
            minMulti = MultiThreadMinFinder.findMin(data, threadCount);
        } catch (InterruptedException e) {
            System.out.println("Multithreaded min calculation interrupted");
            e.printStackTrace();
            return;
        } catch (ExecutionException e) {
            System.out.println("Execution exception in multithreaded min calculation");
            e.printStackTrace();
            return;
        }
        long endMulti = System.nanoTime();
        long timeMulti = endMulti - startMulti;

        // d) Find min using single thread
        long startSingle = System.nanoTime();
        int minSingle = SingleThreadMinFinder.findMin(data);
        long endSingle = System.nanoTime();
        long timeSingle = endSingle - startSingle;

        // e) Compare results and performance
        System.out.println("=======================================");
        System.out.println("Minimum using 5 threads       : " + minMulti);
        System.out.println("Minimum using single thread   : " + minSingle);
        System.out.println("Both minimums are equal?      : " + (minMulti == minSingle));
        System.out.println("---------------------------------------");
        System.out.println("Time with threads (ns)        : " + timeMulti);
        System.out.println("Time without threads (ns)     : " + timeSingle);
        System.out.println("Time with threads (ms approx.): " + (timeMulti / 1_000_000.0));
        System.out.println("Time single thread (ms approx): " + (timeSingle / 1_000_000.0));
        System.out.println("=======================================");
    }
}
