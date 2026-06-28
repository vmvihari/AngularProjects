import { TimeAgoPipe } from './time-ago.pipe';

describe('TimeAgoPipe', () => {
  let pipe: TimeAgoPipe;

  beforeEach(() => {
    // Arrange: Setup the test state
    pipe = new TimeAgoPipe();
  });

  it('should create an instance', () => {
    // Assert
    expect(pipe).toBeTruthy();
  });

  it('should return "Just now" for a date less than a minute ago', () => {
    // Arrange
    const now = new Date();
    const tenSecondsAgo = new Date(now.getTime() - 10000);
    
    // Act
    const result = pipe.transform(tenSecondsAgo.toISOString());

    // Assert
    expect(result).toBe('Just now');
  });

  it('should return the correct minute string', () => {
    // Arrange
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - (5 * 60000));
    
    // Act
    // Assert
    expect(pipe.transform(fiveMinutesAgo.toISOString())).toBe('5 minutes ago');
  });
});
