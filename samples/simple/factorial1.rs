
fn factorial(n) {
    if n == 1 {
        1
    }
    else {
        n * factorial(n - 1)
    }
}

fn main() {
    let mut n = 1;
    
    while n <= 10 {
        println!(factorial(n));
        n = n + 1;
    }
}

