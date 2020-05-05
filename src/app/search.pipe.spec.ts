import { SearchPipe } from "./search.pipe";


describe('SearchPipe', () => {
  const pipe = new SearchPipe();
  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return null when no match is found', () => {
    expect(pipe.transform(['Haryana', 'west bengal'], 'gh')).toEqual([]);
  });

  it('should return possible matches when search value is found', () => {
    expect(pipe.transform(['Haryana', 'west bengal'], 'Har')).toEqual(['Haryana']);
  });
});
