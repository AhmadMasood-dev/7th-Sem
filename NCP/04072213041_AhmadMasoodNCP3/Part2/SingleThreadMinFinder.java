public class SingleThreadMinFinder {

    // d) Find minimum using single main thread (no multithreading)
    public static int findMin(int[] data) {
        if (data.length == 0) {
            throw new IllegalArgumentException("Array is empty.");
        }

        int min = Integer.MAX_VALUE;
        for (int value : data) {
            if (value < min) {
                min = value;
            }
        }
        return min;
    }
}
